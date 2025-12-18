export interface Earnings {
    date: string;
    epsActual: number;
    epsEstimate: number;
    hour: string;
    quarter: number;
    revenueActual: number;
    revenueEstimate: number;
    symbol: string;
    year: number;
}

export interface EarningsCalendarResponse {
    earningsCalendar: Earnings[];
}

export interface EarningCalenderQuery {
    from: string
    symbol?: string
    to: string
}