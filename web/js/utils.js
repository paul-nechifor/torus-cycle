export function changesSign(base, subtract) {
    var result = base - subtract;
    if ((base < 0 && result >= 0) || (base > 0 && result <= 0)) {
        return true;
    }
    return false;
}
