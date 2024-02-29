import { isDeepStrictEqual } from "util";

type calcRetirementIncomeDeductionInput = {
    yearsServiced: number,
    isDisabled: boolean
} 

type calcTaxationTargetAmountInput = {
    yearsServiced: number,
    retirementIncome: number,
    isExecutiveOfficer: boolean,
    deduction: number
}

export const calcRetirementIncomeDeduction = (input: calcRetirementIncomeDeductionInput) => {
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

//課税対象金額算出
export const calcTaxationTargetAmount = (input: calcTaxationTargetAmountInput) => {
    //対象金額
    let targetAmount;
    //退職所得 - 控除額
    let diffIncomeAndDeduction = input.retirementIncome - input.deduction
    //(退職所得 - 控除額) <= 0円の場合
    if (diffIncomeAndDeduction <= 0) {
        return 0;
    }
    //勤続年数5年以下の場合
    if (input.yearsServiced <= 5) {
        //役員等の場合
        if (input.isExecutiveOfficer === true) {
            targetAmount = diffIncomeAndDeduction;
        //役員等以外、かつ(退職所得 - 控除額) > 300万円 の場合
        } else if (input.isExecutiveOfficer === false && diffIncomeAndDeduction > 300_0000) {
            targetAmount = 300_0000 / 2 + (diffIncomeAndDeduction - 300_0000)
        //役員等以外、かつ(退職所得 - 控除額) <= 300万円 の場合
        } else
            targetAmount = diffIncomeAndDeduction / 2;
    //勤続年数5年を超える場合
    } else {
        targetAmount = diffIncomeAndDeduction / 2;
    }
    //1000円未満を切り捨て
    targetAmount = Math.floor(targetAmount / 1000) * 1000;
    return targetAmount;
} 
