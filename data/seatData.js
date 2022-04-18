export const seatsData = []
export const seatCreation = () => {
  for (let i = 1; i <= 8; i++) {
    let row = []
    for (let j = 1; j <= 8; j++) {
      let name = `${String.fromCharCode(64 + i)}-${j}`
      row.push({ name })
    }
    seatsData.push(row)
  }
}
