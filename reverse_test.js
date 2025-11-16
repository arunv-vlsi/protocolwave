// Simple Node-only test harness for bit reversal functions

function hexToBinary(hex) {
    return hex.split('').map(c => 
        parseInt(c, 16).toString(2).padStart(4, '0')
    ).join('');
}

function binToHex(bin) {
    const padded = bin.padStart(Math.ceil(bin.length / 4) * 4, '0');
    let out = '';
    for (let i = 0; i < padded.length; i += 4) {
        const nibble = padded.slice(i, i + 4);
        out += parseInt(nibble, 2).toString(16).toUpperCase();
    }
    return out.replace(/^0+(?=\w)/, '');
}

function reverseBits(input, options = {}) {
    const opts = Object.assign({ inputType: 'auto', output: 'binary' }, options);
    if (typeof input !== 'string') input = String(input);
    let s = input.trim();
    if (s.startsWith('0x') || s.startsWith('0X')) s = s.slice(2);

    let inputType = opts.inputType;
    if (inputType === 'auto') {
        if (/^[01]+$/.test(s)) inputType = 'binary';
        else if (/^[0-9A-Fa-f]+$/.test(s)) inputType = 'hex';
        else throw new Error('Unable to detect input type for reverseBits');
    }

    let bin;
    if (inputType === 'hex') {
        bin = hexToBinary(s);
    } else if (inputType === 'binary') {
        if (!/^[01]+$/.test(s)) throw new Error('Invalid binary input');
        bin = s;
    } else {
        throw new Error('Invalid inputType');
    }

    const reversed = bin.split('').reverse().join('');

    if (opts.output === 'binary') return reversed;
    if (opts.output === 'hex') return binToHex(reversed);
    throw new Error('Invalid output option');
}

// Tests
const tests = [
    { in: '1010', inType: 'binary', out: '0101', outType: 'binary' },
    { in: 'A', inType: 'hex', out: '0101', outType: 'binary' },
    { in: 'A', inType: 'hex', out: '5', outType: 'hex' },
    { in: '0F', inType: 'hex', out: 'F0', outType: 'hex' },
    { in: '0011', inType: 'binary', out: '1100', outType: 'binary' }
];

let failed = 0;
for (const t of tests) {
    const res = reverseBits(t.in, { inputType: t.inType, output: t.outType });
    if (res !== t.out) {
        console.error(`FAIL: input=${t.in} (${t.inType}) expected=${t.out} got=${res}`);
        failed++;
    } else {
        console.log(`OK: input=${t.in} -> ${res}`);
    }
}

if (failed) {
    console.error(`${failed} tests failed`);
    process.exit(1);
} else {
    console.log('All tests passed');
}
