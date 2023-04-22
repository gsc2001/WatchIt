export const getSavedPasscode = (roomId: string) => {
    let passcode = '';
    try {
        const savedPasscodesString =
            window.localStorage.getItem('watchit_passcodes');
        const savedPasscodes = JSON.parse(savedPasscodesString || '{}');
        passcode = savedPasscodes[roomId] || '';
    } catch (e) {
        console.error('Cant parse passcodes', e);
    }

    return passcode;
};

export const savePasscode = (roomId: string, passcode: string) => {
    let savedPasscodes: StringDict = {};
    try {
        const savedPasscodesString =
            window.localStorage.getItem('watchit_passcodes');
        savedPasscodes = JSON.parse(savedPasscodesString || '{}');
    } catch (e) {
        console.error('Cant parse passwords', e);
    }

    savedPasscodes[roomId] = passcode;
    window.localStorage.setItem(
        'watchit_passcodes',
        JSON.stringify(savedPasscodes)
    );
};
