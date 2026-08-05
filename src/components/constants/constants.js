const fps = 10

export const constants = {
    timeInterval: 1000 / fps,
    minAge: 10,
    maxAge: 99,
    minWeight: 10,
    maxWeight: 199,
    minHeight: 100,
    maxHeight: 299,
    emailRegex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    passwordRegex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,24}$/gm,
    visibilityThreshold: 0.5,
    modelToUse: 'BLAZEPOSE'
}