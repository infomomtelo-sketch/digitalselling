import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const useFollow = (creatorId: string | undefined) => {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!creatorId) return;

    // Get follower count
    supabase
      .from("follows")
      .select("id", { count: "exact", head: true })
      .eq("following_id", creatorId)
      .then(({ count }) => setFollowerCount(count ?? 0));

    // Check if current user follows
    if (user) {
      supabase
        .from("follows")
        .select("id")
        .eq("follower_id", user.id)
        .eq("following_id", creatorId)
        .maybeSingle()
        .then(({ data }) => setIsFollowing(!!data));
    }
  }, [creatorId, user]);

  const toggleFollow = useCallback(async () => {
    if (!user || !creatorId || loading) return;
    setLoading(true);

    if (isFollowing) {
      await supabase
        .from("follows")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", creatorId);
      setIsFollowing(false);
      setFollowerCount((c) => Math.max(0, c - 1));
    } else {
      await supabase
        .from("follows")
        .insert({ follower_id: user.id, following_id: creatorId });
      setIsFollowing(true);
      setFollowerCount((c) => c + 1);
    }

    setLoading(false);
  }, [user, creatorId, isFollowing, loading]);

  return { isFollowing, followerCount, toggleFollow, loading };
};
