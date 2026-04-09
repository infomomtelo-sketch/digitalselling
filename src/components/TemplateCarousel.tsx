import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Download, Star, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { templates } from "@/data/templates";

const TemplateCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    setTimeout(checkScroll, 400);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium mb-3">
              <Sparkles size={12} />
              Ready-Made Templates
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
              Pick a Template, Launch Instantly
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Free & premium website templates — click, customize, go live
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
            >
              <ChevronLeft size={18} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
            >
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 -mx-4 px-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {templates.map((template, i) => (
            <Link
              to={`/templates/${template.id}`}
              key={template.id}
              className="flex-shrink-0 snap-start"
              style={{ width: "min(340px, 80vw)" }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="group rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col"
              >
                {/* Template preview image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={template.image}
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    width={800}
                    height={512}
                  />
                  {/* Overlay badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {template.isFree ? (
                      <Badge className="bg-emerald-500/90 text-white text-[10px] border-0 px-2 shadow-sm">
                        Free
                      </Badge>
                    ) : (
                      <Badge className="magnetic-gradient text-white text-[10px] border-0 px-2 shadow-sm">
                        ${template.price}
                      </Badge>
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm text-[10px] border-border"
                  >
                    {template.category}
                  </Badge>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white text-xs font-medium">Click to preview →</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-heading text-sm font-semibold text-card-foreground mb-1">
                    {template.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed flex-1">
                    {template.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <Star size={10} className="text-amber-500 fill-amber-500" />
                      <span>{template.rating}</span>
                      <span>·</span>
                      <Download size={10} />
                      <span>{template.downloads}</span>
                    </div>
                    <div className="flex gap-1">
                      {template.techStack.slice(0, 2).map((t) => (
                        <span
                          key={t}
                          className="text-[9px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Mobile scroll hint */}
        <div className="flex sm:hidden justify-center gap-1.5 mt-4">
          {templates.map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-border" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TemplateCarousel;
