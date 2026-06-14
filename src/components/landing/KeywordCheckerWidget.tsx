import { useState } from "react";
import { Search, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const STOPWORDS = new Set([
  "a","about","above","after","again","against","all","am","an","and","any","are","as","at",
  "be","because","been","before","being","below","between","both","but","by","can","could",
  "did","do","does","doing","down","during","each","few","for","from","further","get","got",
  "had","has","have","having","he","her","here","hers","herself","him","himself","his","how",
  "i","if","in","into","is","it","its","itself","just","let","like","ll","may","me","might",
  "more","most","must","my","myself","no","nor","not","now","of","off","on","once","only",
  "or","other","our","ours","ourselves","out","over","own","re","s","same","shall","she",
  "should","so","some","such","t","than","that","the","their","theirs","them","themselves",
  "then","there","these","they","this","those","through","to","too","under","until","up",
  "ve","very","was","we","were","what","when","where","which","while","who","whom","why",
  "will","with","would","you","your","yours","yourself","yourselves","also","well","us",
  "using","used","use","new","work","working","including","include","able","ensure",
  "based","etc","within","across","along","among","around","per","via","strong","good",
  "great","best","looking","join","team","role","position","opportunity","company",
  "candidates","candidate","responsibilities","requirements","required","preferred",
  "experience","years","year","minimum","must","ability","skills","skill","knowledge",
  "understanding","excellent","proven","demonstrated","familiar","proficient",
]);

function extractKeywords(text: string): { word: string; count: number; importance: "high" | "medium" | "low" }[] {
  const words = text.toLowerCase().replace(/[^a-z0-9\s\-/+#.]/g, " ").split(/\s+/);
  
  // Count individual words
  const freq: Record<string, number> = {};
  for (const w of words) {
    if (w.length < 3 || STOPWORDS.has(w) || /^\d+$/.test(w)) continue;
    freq[w] = (freq[w] || 0) + 1;
  }

  // Also extract 2-word phrases
  for (let i = 0; i < words.length - 1; i++) {
    const phrase = `${words[i]} ${words[i + 1]}`;
    if (words[i].length >= 3 && words[i + 1].length >= 3 && !STOPWORDS.has(words[i]) && !STOPWORDS.has(words[i + 1])) {
      freq[phrase] = (freq[phrase] || 0) + 1;
    }
  }

  const sorted = Object.entries(freq)
    .filter(([, count]) => count >= 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12);

  if (sorted.length === 0) return [];

  const maxCount = sorted[0][1];
  return sorted.map(([word, count]) => ({
    word,
    count,
    importance: count >= maxCount * 0.7 ? "high" : count >= maxCount * 0.4 ? "medium" : "low",
  }));
}

const KeywordCheckerWidget = () => {
  const [jd, setJd] = useState("");
  const [keywords, setKeywords] = useState<ReturnType<typeof extractKeywords>>([]);
  const [hasChecked, setHasChecked] = useState(false);

  const handleCheck = () => {
    if (jd.trim().length < 20) return;
    const results = extractKeywords(jd);
    setKeywords(results);
    setHasChecked(true);
  };

  const importanceColors = {
    high: "bg-primary/20 text-primary border-primary/30",
    medium: "bg-accent/50 text-accent-foreground border-accent",
    low: "bg-muted text-muted-foreground border-border",
  };

  return (
    <div id="keyword-checker" className="w-full">
      <div className="relative glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7 border border-border/50">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs sm:text-sm font-semibold text-foreground">Instant Keyword Check</span>
          <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">Free</span>
        </div>

        <Textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste a job description here to see the top keywords you need in your resume..."
          className="min-h-[80px] sm:min-h-[100px] lg:min-h-[120px] text-sm bg-background/50 border-border/50 resize-none mb-3"
          rows={3}
        />

        <Button
          onClick={handleCheck}
          disabled={jd.trim().length < 20}
          variant="glow"
          size="sm"
          className="w-full gap-2 rounded-lg h-9 text-sm font-semibold"
        >
          <Search className="w-3.5 h-3.5" />
          Check Keywords
        </Button>

        {hasChecked && keywords.length > 0 && (
          <div className="mt-4 space-y-3 animate-fade-in-up">
            <p className="text-xs text-muted-foreground font-medium">
              Top keywords to include in your resume:
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {keywords.map((kw) => (
                <span
                  key={kw.word}
                  className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-[0.65rem] sm:text-xs font-medium border ${importanceColors[kw.importance]}`}
                >
                  {kw.word}
                  {kw.count > 1 && (
                    <span className="opacity-60">×{kw.count}</span>
                  )}
                </span>
              ))}
            </div>
            <Link to="/upload" className="block">
              <Button variant="outline" size="sm" className="w-full gap-2 rounded-lg h-9 text-xs mt-1 border-primary/30 text-primary hover:bg-primary/5">
                Upload your resume to check which you're missing
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        )}

        {hasChecked && keywords.length === 0 && (
          <p className="mt-3 text-xs text-muted-foreground text-center">
            No keywords found. Try pasting a longer job description.
          </p>
        )}
      </div>
    </div>
  );
};

export default KeywordCheckerWidget;
