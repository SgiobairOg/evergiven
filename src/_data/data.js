const currentTime = () => {
    const buildTime = new Date(Date.now());

    return {
        date: buildTime.toLocaleDateString(),
        time: buildTime.toLocaleTimeString()
    }
}

const between = (number, min, max) => {
    return number <= max && number >= min;
}

const getCurrentStatus = async () => {
    const aisSource = 'https://www.vesselfinder.com/vessels/EVER-GIVEN-IMO-9811000-MMSI-353136000'
    const puppeteer = require('puppeteer');

    const browser = await puppeteer.launch({ args: ["--proxy-server='direct://'", '--proxy-bypass-list=*']})
    const page = await browser.newPage()
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36')
    await page.goto(aisSource)
    await page.waitForSelector('.tparams')
    
    const [heading, speed] = await page.$$eval('.tparams tr', params => {
        const courseParam = params.find(parameter => {
            return parameter.querySelector('.n3') && parameter.querySelector('.n3').textContent === 'Course / Speed'
        })
        return courseParam.querySelector('.v3').textContent.split(' / ')
    })

    const [lat, long] = await page.$$eval('.tparams tr', params => {
        const positionParam = params.find(parameter => {
            return parameter.querySelector('.n3') && parameter.querySelector('.n3').textContent === 'Coordinates'
        })
        return positionParam.querySelector('.v3').textContent.split('/')
    })
    
    const stuck = (lat, speed) => between(lat, 30, 30.0333) && speed <= 1.0 

    return {
        heading,
        speed,
        lat,
        long,
        'stuck': stuck(parseFloat(lat), parseFloat(speed))
    }
}

module.exports = async function() {
    const time = currentTime();
    const currentStatus = await getCurrentStatus();

    return {
        'currentTime': time,
        'currentStatus': currentStatus,
    }
};