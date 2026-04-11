import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description?: string;
}

const SEOHead = ({ title, description }: SEOHeadProps) => {
  useEffect(() => {
    document.title = title;
    if (description) {
      let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }
      meta.content = description;
    }
  }, [title, description]);

  return null;
};

export default SEOHead;
