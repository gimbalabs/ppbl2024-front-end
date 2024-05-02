/**
 *
 * @param {string} str a readable string
 * @returns hex string
 */
export function stringToHex(str: string) {
    const arr: string[] = [];
    for (let i = 0; i < str.length; i++) {
      arr[i] = str.charCodeAt(i).toString(16);
    }
    return arr.join("");
  }

  /**
   * @param {string} input a hex string
   * @returns a readable string
   */
  export function hexToString(input: string) {
    const hex = input.toString();
    let str = "";
    for (let n = 0; n < hex.length; n += 2) {
      str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
  }

  /**
   *
   * @param posix a posix timestamp
   * @returns YYYY-MM-DD date string
   */
  export function posixToDateString(posix: number): string {
    const date = new Date(posix);
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${(date.getDate() + 1).toString().padStart(2, "0")}`;
  }
