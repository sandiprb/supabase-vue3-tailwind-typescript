import { supabase } from "@/lib/supabase";
import { userSession } from "@/use/useAuth";
import { SupabaseEventTypes } from "@supabase/supabase-js/dist/main/lib/types";
import { v4 } from "uuid";
import { onMounted, ref } from "vue";

const userNotes = ref<Array<INote>>([]);

export default function useNote() {
  const createNote = async ({
    title,
    content,
  }: {
    title: string;
    content: string;
  }) => {
    const formData = {
      id: v4(),
      user_id: userSession.value?.user.id,
      title,
      content,
    };
    const { data, error } = await supabase.from("note").insert([formData]);
    if (error) {
      alert(error.message);
    }
    return { data, error };
  };

  const fetchUserNotes = async () => {
    const { data, error } = await supabase
      .from("note")
      .select("title, id, updated_at")
      .eq("user_id", userSession.value?.user.id)
      .order("updated_at");
    if (error) {
      alert(error.message);
    } else {
      userNotes.value = data as any;
    }
  };

  const fetchNoteDetails = async (id: string) => {
    const { data, error } = await supabase
      .from("note")
      .select("*")
      .eq("id", id)
      .eq("user_id", userSession.value?.user.id);
    if (error) {
      alert(error.message);
    }
    return { data, error };
  };

  const updateNote = async ({
    id,
    title,
    content,
  }: {
    id: string;
    title: string;
    content: string;
  }) => {
    const { data, error } = await supabase
      .from("note")
      .update({
        title,
        content,
      })
      .eq("id", id);
    if (error) {
      alert(error.message);
    }
    return { data, error };
  };

  const subscribeUserNotes = () => {
    const updateNotes = (eventType: SupabaseEventTypes, note: INote) => {
      console.log({eventType, note})
      switch (eventType) {
        case "DELETE":
          userNotes.value = userNotes.value.filter((n) => n.id !== note.id);
          break;
        case "UPDATE":
          userNotes.value = userNotes.value.map((oldNote) =>
            oldNote.id === note.id ? note : oldNote
          );
          break
        case "INSERT":
          userNotes.value = [note, ...userNotes.value];
          break
        default:
          break;
      }
    };
    supabase
      .from("note")
      .on("*", (payload) => {
        updateNotes(payload.eventType, payload.new);
      })
      .subscribe();
  };

  onMounted(() => {
    fetchUserNotes();
    subscribeUserNotes();
  });

  return {
    userNotes,
    createNote,
    fetchUserNotes,
    fetchNoteDetails,
    updateNote,
  };
}
