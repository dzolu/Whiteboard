export const dataAttr = (e: any, name: string): string => {
    return (e && e.target && e.target.attributes && e.target.attributes[`data-${name}`] && e.target.attributes[`data-${name}`].textContent) || ""
};