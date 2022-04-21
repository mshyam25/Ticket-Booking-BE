export const seatsData = []
export const seatCreation = () => {
  for (let i = 1; i <= 10; i++) {
    let row = []
    for (let j = 1; j <= 10; j++) {
      let name = `${String.fromCharCode(64 + i)}-${j}`
      row.push({ name })
    }
    seatsData.push(row)
  }
}
