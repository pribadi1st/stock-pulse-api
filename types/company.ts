import { Company } from "../src/companies/entities/company.entity";

export interface SearchCompanyResponse {
    total: number;
    companies: Company[];
}