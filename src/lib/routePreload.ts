// Preloadable lazy route factories
const lazyWithPreload = (factory: () => Promise<{ default: ComponentType<unknown> }>) => {
  const Component = lazy(factory);
  return { Component, preload: factory };
};

import { lazy, ComponentType } from "react";

// Route modules with preload capability
export const routes = {
  Index: lazyWithPreload(() => import("@/pages/Index")),
  Upload: lazyWithPreload(() => import("@/pages/Upload")),
  Results: lazyWithPreload(() => import("@/pages/Results")),
  CoverLetter: lazyWithPreload(() => import("@/pages/CoverLetter")),
  CoverLetterResults: lazyWithPreload(() => import("@/pages/CoverLetterResults")),
  About: lazyWithPreload(() => import("@/pages/About")),
  Contact: lazyWithPreload(() => import("@/pages/Contact")),
  ResumeTips: lazyWithPreload(() => import("@/pages/ResumeTips")),
  FAQ: lazyWithPreload(() => import("@/pages/FAQ")),
  Blog: lazyWithPreload(() => import("@/pages/Blog")),
  Privacy: lazyWithPreload(() => import("@/pages/Privacy")),
  Terms: lazyWithPreload(() => import("@/pages/Terms")),
  NotFound: lazyWithPreload(() => import("@/pages/NotFound")),
  Auth: lazyWithPreload(() => import("@/pages/Auth")),
  SignIn: lazyWithPreload(() => import("@/pages/SignIn")),
  SignUp: lazyWithPreload(() => import("@/pages/SignUp")),
  Dashboard: lazyWithPreload(() => import("@/pages/Dashboard")),
  Pricing: lazyWithPreload(() => import("@/pages/Pricing")),
};

// Map paths to preload functions
const pathPreloadMap: Record<string, () => void> = {
  "/": routes.Index.preload,
  "/upload": routes.Upload.preload,
  "/results": routes.Results.preload,
  "/cover-letter": routes.CoverLetter.preload,
  "/cover-letter/results": routes.CoverLetterResults.preload,
  "/about": routes.About.preload,
  "/contact": routes.Contact.preload,
  "/resume-tips": routes.ResumeTips.preload,
  "/faq": routes.FAQ.preload,
  "/blog": routes.Blog.preload,
  "/privacy": routes.Privacy.preload,
  "/terms": routes.Terms.preload,
  "/auth": routes.Auth.preload,
  "/signin": routes.SignIn.preload,
  "/signup": routes.SignUp.preload,
  "/dashboard": routes.Dashboard.preload,
  "/pricing": routes.Pricing.preload,
};

export const preloadRoute = (path: string) => {
  const preload = pathPreloadMap[path];
  if (preload) preload();
};
