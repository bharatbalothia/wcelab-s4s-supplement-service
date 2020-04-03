module.exports = {
    getTimeAfterSeconds: (timeInSeconds) => {
        var currentDate = new Date();
        currentDate.setSeconds(currentDate.getSeconds() + timeInSeconds);
        return currentDate.getTime();
    },

    getTimeDifferenceInSeconds: (futureDate, pastDate) => {
        return Math.floor((futureDate.getTime() - pastDate.getTime()) / 1000);
    }
}
