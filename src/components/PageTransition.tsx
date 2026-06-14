import { ReactNode } from "react";

const PageTransition = ({ children }: { children: ReactNode }) => (
  <div className="animate-page-fade-in">
    {children}
  </div>
);

export default PageTransition;
