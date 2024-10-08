export const getDateLastWeek = () => {
    let now = new Date(new Date().toUTCString());
    now.setUTCHours(now.getUTCHours() - 3) // UTC-3 ARGENTINA
    let lastWeek = new Date(now)
    lastWeek.setDate(now.getDate() - 7)
    return lastWeek
  }