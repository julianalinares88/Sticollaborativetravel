import { supabase } from "./supabase";

// Genera código de 6 caracteres (sin O, 0, I, 1 para evitar confusiones).
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export function generateInviteCode(): string {
  return Array.from(
    { length: 6 },
    () => CHARS[Math.floor(Math.random() * CHARS.length)]
  ).join("");
}

export interface GroupMember {
  id: string;
  username: string;
  avatarUrl: string | null;
  isCreator: boolean;
  hasResponded: boolean;
}

async function currentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export async function createGroup(name: string) {
  const uid = await currentUserId();
  if (!uid)
    return {
      data: null as null | { id: string; name: string; invite_code: string },
      error: "No hay sesión activa.",
    };

  // Reintenta si hay colisión de código (muy raro).
  for (let i = 0; i < 5; i++) {
    const code = generateInviteCode();
    const { data, error } = await supabase
      .from("groups")
      .insert({ name: name.trim(), created_by: uid, invite_code: code })
      .select("id, name, invite_code")
      .single();
    if (!error && data) return { data, error: null };
    if (error && (error as { code?: string }).code !== "23505") {
      return { data: null, error: error.message };
    }
  }
  return { data: null, error: "No se pudo generar un código único. Intenta de nuevo." };
}

export async function joinGroupByCode(rawCode: string) {
  const uid = await currentUserId();
  if (!uid)
    return {
      data: null as null | { id: string; name: string; invite_code: string },
      error: "No hay sesión activa.",
    };

  const code = rawCode.trim().toUpperCase();
  const { data: group, error: findErr } = await supabase
    .from("groups")
    .select("id, name, invite_code")
    .eq("invite_code", code)
    .maybeSingle();
  if (findErr) return { data: null, error: findErr.message };
  if (!group) return { data: null, error: "No existe un grupo con ese código." };

  const { error: joinErr } = await supabase
    .from("group_members")
    .insert({ group_id: group.id, user_id: uid });
  // 23505 = ya eres miembro -> lo tratamos como éxito.
  if (joinErr && (joinErr as { code?: string }).code !== "23505") {
    return { data: null, error: joinErr.message };
  }
  return { data: group, error: null };
}

export async function getGroupMembers(
  groupId: string
): Promise<{ data: GroupMember[]; error: string | null }> {
  const { data: group, error: gErr } = await supabase
    .from("groups")
    .select("created_by")
    .eq("id", groupId)
    .maybeSingle();
  if (gErr) return { data: [], error: gErr.message };

  const { data: rows, error: mErr } = await supabase
    .from("group_members")
    .select("user_id, joined_at, profiles(id, username, avatar_url)")
    .eq("group_id", groupId)
    .order("joined_at", { ascending: true });
  if (mErr) return { data: [], error: mErr.message };

  const list = (rows ?? []) as Array<{
    user_id: string;
    profiles: { username?: string; avatar_url?: string | null } | null;
  }>;
  const memberIds = list.map((r) => r.user_id);

  // Quién ya llenó sus preferencias (RLS permite ver las de co-miembros).
  let responded = new Set<string>();
  if (memberIds.length) {
    const { data: prefs } = await supabase
      .from("user_preferences")
      .select("user_id")
      .in("user_id", memberIds);
    responded = new Set((prefs ?? []).map((p: { user_id: string }) => p.user_id));
  }

  const members: GroupMember[] = list.map((r) => ({
    id: r.user_id,
    username: r.profiles?.username ?? "Usuario",
    avatarUrl: r.profiles?.avatar_url ?? null,
    isCreator: group?.created_by === r.user_id,
    hasResponded: responded.has(r.user_id),
  }));
  return { data: members, error: null };
}

export interface GroupSummary {
  id: string;
  name: string;
  invite_code: string;
  is_owner: boolean;
  member_count: number;
  ready_count: number; // miembros con preferencias llenas
  has_results: boolean; // el grupo ya tiene recomendaciones guardadas
}

export async function getMyGroups(): Promise<{
  data: GroupSummary[];
  currentUserHasPrefs: boolean;
  error: string | null;
}> {
  const uid = await currentUserId();
  if (!uid) return { data: [], currentUserHasPrefs: false, error: "No hay sesión activa." };

  // 1) Grupos donde soy miembro
  const { data: memberships, error: mErr } = await supabase
    .from("group_members")
    .select("groups(id, name, invite_code, created_by)")
    .eq("user_id", uid);
  if (mErr) return { data: [], currentUserHasPrefs: false, error: mErr.message };

  const groups = (memberships ?? [])
    .map((m: { groups: unknown }) => m.groups)
    .filter(Boolean) as Array<{
    id: string;
    name: string;
    invite_code: string;
    created_by: string;
  }>;

  if (!groups.length) {
    const { data: myPrefs } = await supabase
      .from("user_preferences")
      .select("user_id")
      .eq("user_id", uid)
      .maybeSingle();
    return { data: [], currentUserHasPrefs: !!myPrefs, error: null };
  }

  const groupIds = groups.map((g) => g.id);

  // 2) Todos los miembros de esos grupos (1 query)
  const { data: allMembers } = await supabase
    .from("group_members")
    .select("group_id, user_id")
    .in("group_id", groupIds);
  const memberRows = (allMembers ?? []) as Array<{ group_id: string; user_id: string }>;

  // 3) Quiénes de esos miembros tienen preferencias (1 query)
  const allUserIds = Array.from(new Set(memberRows.map((r) => r.user_id)));
  let responded = new Set<string>();
  if (allUserIds.length) {
    const { data: prefs } = await supabase
      .from("user_preferences")
      .select("user_id")
      .in("user_id", allUserIds);
    responded = new Set((prefs ?? []).map((p: { user_id: string }) => p.user_id));
  }

  // 4) Qué grupos ya tienen recomendaciones guardadas (1 query)
  const { data: recRows } = await supabase
    .from("recommendations")
    .select("group_id")
    .in("group_id", groupIds);
  const groupsWithResults = new Set(
    (recRows ?? []).map((r: { group_id: string }) => r.group_id)
  );

  const data: GroupSummary[] = groups.map((g) => {
    const members = memberRows.filter((r) => r.group_id === g.id);
    return {
      id: g.id,
      name: g.name,
      invite_code: g.invite_code,
      is_owner: g.created_by === uid,
      member_count: members.length,
      ready_count: members.filter((r) => responded.has(r.user_id)).length,
      has_results: groupsWithResults.has(g.id),
    };
  });

  return { data, currentUserHasPrefs: responded.has(uid), error: null };
}

// Eliminar grupo (solo el dueño; RLS lo valida). El cascade borra miembros y recomendaciones.
export async function deleteGroup(groupId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from("groups").delete().eq("id", groupId);
  return { error: error ? error.message : null };
}

// Salir de un grupo (borra tu propia membresía; RLS lo permite).
export async function leaveGroup(groupId: string): Promise<{ error: string | null }> {
  const uid = await currentUserId();
  if (!uid) return { error: "No hay sesión activa." };
  const { error } = await supabase
    .from("group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", uid);
  return { error: error ? error.message : null };
}