import { ListTodo, ChevronRight } from "lucide-react";
import type { AnalysisResult } from "@/types/analysis";

interface ActionItemsProps {
  result: AnalysisResult;
}

const ActionItems = ({ result }: ActionItemsProps) => {
  const { action_items } = result;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive/10 border-destructive/30 text-destructive";
      case "medium":
        return "bg-warning/10 border-warning/30 text-warning";
      default:
        return "bg-muted border-border text-muted-foreground";
    }
  };

  const getPriorityBg = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive/5 border-destructive/20 hover:border-destructive/40";
      case "medium":
        return "bg-warning/5 border-warning/20 hover:border-warning/40";
      default:
        return "bg-muted/50 border-border hover:border-muted-foreground/30";
    }
  };

  // Sort by priority
  const sortedItems = [...action_items].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 animate-fade-in-up sticky top-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center">
          <ListTodo className="w-5 h-5 text-success" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Action Items</h2>
          <p className="text-sm text-muted-foreground">Priority fixes</p>
        </div>
      </div>

      <div className="space-y-3">
        {sortedItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${getPriorityBg(item.priority)}`}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                {index + 1}
              </div>
              <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase border ${getPriorityColor(item.priority)}`}>
                {item.priority}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground text-sm">{item.action}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.impact}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionItems;
