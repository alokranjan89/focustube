const DASHBOARD_ID = 'focustube-home-replacement'
let cleanupStarted = false

export function removeDashboard(): void {
  document.querySelectorAll(`#${DASHBOARD_ID}`).forEach((element) => element.remove())
}

export function startDashboardCleanup(): void {
  if (cleanupStarted) {
    return
  }

  cleanupStarted = true
  removeDashboard()
  window.setInterval(removeDashboard, 250)
}
