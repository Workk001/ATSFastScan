import { forwardRef } from "react";
import { Link, LinkProps } from "react-router-dom";
import { preloadRoute } from "@/lib/routePreload";

/**
 * A Link that preloads the target route's chunk on hover/focus,
 * so navigation feels instant.
 */
const PreloadLink = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ to, onMouseEnter, onFocus, ...props }, ref) => {
    const path = typeof to === "string" ? to : to.pathname || "";

    const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
      preloadRoute(path);
      onMouseEnter?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLAnchorElement>) => {
      preloadRoute(path);
      onFocus?.(e);
    };

    return (
      <Link
        ref={ref}
        to={to}
        onMouseEnter={handleMouseEnter}
        onFocus={handleFocus}
        {...props}
      />
    );
  }
);

PreloadLink.displayName = "PreloadLink";
export default PreloadLink;
