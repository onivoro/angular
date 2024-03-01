var REGEX = /[A-Z]/g;
export function kebabCase(name: string, separator = '-') {
    separator = separator || '_';
    return name.replace(REGEX, function (letter, pos) {
        return (pos ? separator : '') + letter.toLowerCase();
    });
}