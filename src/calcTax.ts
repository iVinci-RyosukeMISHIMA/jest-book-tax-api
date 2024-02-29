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

//基準所得税額算出
export const calcBaseIncomeAmount = (taxationTargetAmount: number) => {
    //税率・控除額のグループリスト
    const taxGroups = [{taxRate: 0.05, fixedDeduction: 0}, {taxRate: 0.1, fixedDeduction: 97_500},{taxRate: 0.2, fixedDeduction: 427_500},{taxRate: 0.23, fixedDeduction: 636_000},{taxRate: 0.33, fixedDeduction: 1_536_000},{taxRate: 0.4, fixedDeduction: 2_796_000},{taxRate: 0.45, fixedDeduction: 4_796_000}] 
    if (1_000 <= taxationTargetAmount && taxationTargetAmount <= 1_949_000) {
        return taxationTargetAmount * taxGroups[0].taxRate - taxGroups[0].fixedDeduction;
    } else if (1_950_000 <= taxationTargetAmount && taxationTargetAmount <= 3_299_000) {
        return taxationTargetAmount * taxGroups[1].taxRate - taxGroups[1].fixedDeduction;
    } else if (3_300_000 <= taxationTargetAmount && taxationTargetAmount <= 6_949_000) {
        return taxationTargetAmount * taxGroups[2].taxRate - taxGroups[2].fixedDeduction;
    } else if (6_950_000 <= taxationTargetAmount && taxationTargetAmount <= 8_999_000) {
        return taxationTargetAmount * taxGroups[3].taxRate - taxGroups[3].fixedDeduction;
    } else if (9_000_000 <= taxationTargetAmount && taxationTargetAmount <= 17_999_000) {
        return taxationTargetAmount * taxGroups[4].taxRate - taxGroups[4].fixedDeduction;
    } else if (18_000_000 <= taxationTargetAmount && taxationTargetAmount <= 39_999_000) {
        return taxationTargetAmount * taxGroups[5].taxRate - taxGroups[5].fixedDeduction;
    } else if (40_000_000 <= taxationTargetAmount) {
        return taxationTargetAmount * taxGroups[6].taxRate - taxGroups[6].fixedDeduction;
    }
}