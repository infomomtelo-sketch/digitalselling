import { useState, useEffect } from "react";
import { Star, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer_id: string;
  reviewer_name?: string;
  reviewer_avatar?: string;
}

const StarRating = ({ rating, onRate, interactive = false }: { rating: number; onRate?: (r: number) => void; interactive?: boolean }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        size={interactive ? 20 : 14}
        className={`${i <= rating ? "text-amber-500 fill-amber-500" : "text-muted-foreground/30"} ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
        onClick={() => interactive && onRate?.(i)}
      />
    ))}
  </div>
);

const ReviewSection = ({ productId }: { productId: string }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (data) {
      const reviewerIds = [...new Set(data.map((r) => r.reviewer_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url")
        .in("user_id", reviewerIds);

      const profileMap = new Map(profiles?.map((p) => [p.user_id, p]) || []);

      setReviews(
        data.map((r) => ({
          ...r,
          reviewer_name: profileMap.get(r.reviewer_id)?.display_name || "Anonymous",
          reviewer_avatar: profileMap.get(r.reviewer_id)?.avatar_url || undefined,
        }))
      );
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: "Please sign in to leave a review", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      product_id: productId,
      reviewer_id: user.id,
      rating: newRating,
      comment: newComment || null,
    });
    if (error) {
      if (error.code === "23505") {
        toast({ title: "You've already reviewed this product", variant: "destructive" });
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    } else {
      toast({ title: "Review submitted!" });
      setNewComment("");
      setNewRating(5);
      fetchReviews();
    }
    setSubmitting(false);
  };

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "0";

  return (
    <div className="mt-8">
      <div className="flex items-center gap-4 mb-6">
        <h3 className="font-heading text-lg font-bold text-foreground">Reviews</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <StarRating rating={Math.round(Number(avgRating))} />
          <span>{avgRating} ({reviews.length})</span>
        </div>
      </div>

      {/* Write review */}
      {user && (
        <div className="rounded-xl border border-border bg-card p-4 mb-6">
          <p className="text-sm font-medium text-foreground mb-2">Leave a review</p>
          <StarRating rating={newRating} onRate={setNewRating} interactive />
          <Textarea
            className="mt-3"
            rows={3}
            placeholder="Share your experience..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button size="sm" className="mt-3" disabled={submitting} onClick={handleSubmit}>
            <Send size={14} className="mr-1.5" /> {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      )}

      {/* Reviews list */}
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">No reviews yet. Be the first!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary overflow-hidden">
                  {review.reviewer_avatar ? (
                    <img src={review.reviewer_avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    review.reviewer_name?.charAt(0)?.toUpperCase()
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{review.reviewer_name}</p>
                  <StarRating rating={review.rating} />
                </div>
                <span className="ml-auto text-xs text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              {review.comment && <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
