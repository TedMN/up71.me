

export default interface Durations {
    leapYear: string,
    year: string,
    month28: string,
    month29: string,
    month30: string,
    month31: string,
    week167: string,
    week168: string,
    week169: string,
    day23: string,
    day24: string,
    day25: string
}

export const empty = () : Durations => ({
    day23: '',
    day24: '',
    day25: '',
    leapYear: '',
    month28: '',
    month29: '',
    month30: '',
    month31: '',
    week167: '',
    week168: '',
    week169: '',
    year: ''
 });