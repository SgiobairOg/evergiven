const currentTime = () => {
    const buildTime = new Date(Date.now());

    return {
        date: buildTime.toLocaleDateString(),
        time: buildTime.toLocaleTimeString()
    }
}

const getCurrentStatus = () => {
    return new Promise((res, rej) => {
        setTimeout(() => res(true), 3000)
    })
}

module.exports = async function() {
    const time = currentTime();
    const currentStatus = await getCurrentStatus();

    return {
        'currentTime': time,
        'isSheStuck': currentStatus,
    }
};