const fps = 10

export const constants = {
    timeInterval: 1000 / fps,
    absNo: 30,
    pushupsNo: 30,
    squatsNo: 30,
    emailRegex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    passwordRegex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,24}$/gm,
    indices: [11, 12, 13, 14, 15, 16, 23, 24, 25, 26],
    indicesGroups: [[11, 12], [13, 14], [15, 16], [23, 24], [25, 26]],
    visibilityThreshold: 0.5
}