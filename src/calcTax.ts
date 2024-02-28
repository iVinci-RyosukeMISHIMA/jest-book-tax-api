import { isDeepStrictEqual } from "util";

type calcRetirementIncomeDeductionInput = {
        yearsServiced: number,
        isDisabled: boolean
} 

const calcRetirementIncomeDeduction = (input: calcRetirementIncomeDeductionInput) => {
    let deduction;
    const deductionUntil20years = 400_000;
    const deductionAfter20years = 700_000;
    const minimunDeduction = 800_000;
    const extraDeductionIfDisabled = 1000_000
    if (input.yearsServiced < 21) {
        deduction = deductionUntil20years * input.yearsServiced;
        if (deduction < minimunDeduction)
            deduction = minimunDeduction
    } else {
        deduction = deductionUntil20years * 20 + deductionAfter20years * (input.yearsServiced - 20)
    }
    return input.isDisabled ? deduction + extraDeductionIfDisabled : deduction;
}

export default calcRetirementIncomeDeduction;