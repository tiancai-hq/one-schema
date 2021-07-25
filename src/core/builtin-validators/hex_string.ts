export default (input: string) => typeof input === 'string' && input.length !== 0 && !(/[^0-9|a-f]/i.test(input));
