import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const useProductLike = (productId: string | undefined) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId) return;

    supabase
      .from("product_likes")
      .select("id", { count: "exact", head: true })
      .eq("product_id", productId)
      .then(({ count }) => setLikeCount(count ?? 0));

    if (user) {
      supabase
        .from("product_likes")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .maybeSingle()
        .then(({ data }) => setIsLiked(!!data));
    }
  }, [productId, user]);

  const toggleLike = useCallback(async () => {
    if (!user || !productId || loading) return;
    setLoading(true);

    if (isLiked) {
      await supabase
        .from("product_likes")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);
      setIsLiked(false);
      setLikeCount((c) => Math.max(0, c - 1));
    } else {
      await supabase
        .from("product_likes")
        .insert({ user_id: user.id, product_id: productId });
      setIsLiked(true);
      setLikeCount((c) => c + 1);
    }

    setLoading(false);
  }, [user, productId, isLiked, loading]);

  return { isLiked, likeCount, toggleLike, loading };
};
