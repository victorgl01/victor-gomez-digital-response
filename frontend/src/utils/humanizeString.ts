const humanizeString = (val: string): string => {
    const result = String(val).charAt(0).toUpperCase() + String(val).slice(1); // Uppercase primera letra
    return result.replace(/_/g, " "); // Reemplaza guiones bajos por espacios con regex
}

export default humanizeString;
