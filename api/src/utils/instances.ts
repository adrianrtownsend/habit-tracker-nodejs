export const generateInstances = (params: { task: any; task_instances: any }) => {
  const { task, task_instances } = params
  // initial params
  const generatedInstances: any[] = []
  const startDate = new Date(task.startDate)
  const endDate = new Date(task.endDate)

  // current date - to adjust to day set
  let currentDate = startDate
  // iterate through days and add one instant per day
  while (currentDate <= endDate) {
    // check if a day to be scheduled
    if (task.days.includes(currentDate.getDay())) {
      // set timeframe of current day
      let startTime = new Date(currentDate)
      startTime.setHours(task.startHour, task.startMinute, 0, 0)

      let endTime = new Date(currentDate)
      endTime.setHours(task.endHour, task.endMinute, 0, 0)

      // new instace at earliest time
      let instanceStart = new Date(startTime)

      if (task_instances.length === 0) {
        let instanceEnd = new Date(instanceStart)
        instanceEnd.setMinutes(instanceEnd.getMinutes() + task.duration)

        const instance = {
          status: 0, // Default status: NOT AVAILABLE
          startDateTime: instanceStart.toISOString(),
          endDateTime: instanceEnd.toISOString()
        }
        generatedInstances.push(instance)
      } else {
        while (instanceStart <= endTime) {
          // set the time block for the instance start & end
          let instanceEnd = new Date(instanceStart)
          instanceEnd.setMinutes(instanceEnd.getMinutes() + task.duration)

          // Check for conflicts with all existing task instances
          let conflict = false
          for (let existingInstance of task_instances) {
            let existingStart = new Date(existingInstance.startDateTime)
            let existingEnd = new Date(existingInstance.endDateTime)
            if (existingStart < instanceEnd && existingEnd > instanceStart) {
              conflict = true
              instanceStart.setMinutes(instanceStart.getMinutes() + task.gap)
            }
          }
          if (!conflict) {
            const instance = {
              status: 0, // Default status: NOT AVAILABLE
              startDateTime: instanceStart.toISOString(),
              endDateTime: instanceEnd.toISOString()
            }
            generatedInstances.push(instance)
            break
          }
        }
      }
    }

    currentDate.setDate(currentDate.getDate() + 1)
  }

  return generatedInstances
}
