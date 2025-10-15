export const layoutState = $state({
  leftSidebarCollapsed: false,
  rightSidebarCollapsed: false,
  statusBarHeight: 28,
});

export const layoutActions = {
  toggleLeftSidebar: () =>
    (layoutState.leftSidebarCollapsed = !layoutState.leftSidebarCollapsed),
  toggleRightSidebar: () =>
    (layoutState.rightSidebarCollapsed = !layoutState.rightSidebarCollapsed),
};
