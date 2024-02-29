import { calcRetirementIncomeDeduction, calcTaxationTargetAmount } from "../calcTax"

describe("退職所得控除額", () => {
    describe("勤続年数が1年以下の場合", () => {
        test.each`
        yearsServiced | isDisabled | expected
        ${1}          | ${false}   | ${800_000}
        ${1}          | ${true}   | ${1800_000}   
        `(`勤続年数：$yearsServiced, 障害が起因：$isDisabled, 期待値：$expected`, ({ yearsServiced, isDisabled, expected }) => {
            const deduction = calcRetirementIncomeDeduction({ yearsServiced, isDisabled })
            expect(deduction).toBe(expected)
        })
    })
    describe("勤続年数が2~20年の場合", () => {
        test.each`
        yearsServiced | isDisabled | expected
        ${2}          | ${false}   | ${800_000}
        ${3}          | ${false}   | ${1200_000}
        ${19}          | ${false}   | ${7600_000}
        ${20}          | ${false}   | ${8000_000}
        ${2}          | ${true}   | ${1800_000}
        ${3}          | ${true}   | ${2200_000}
        ${19}          | ${true}   | ${8600_000}
        ${20}          | ${true}   | ${9000_000}
        `(`勤続年数：$yearsServiced, 障害が起因：$isDisabled, 期待値：$expected`, ({ yearsServiced, isDisabled, expected }) => {
            const deduction = calcRetirementIncomeDeduction({ yearsServiced, isDisabled })
            expect(deduction).toBe(expected)
        })
    })
    describe("勤続年数が21年以上の場合", () => {
        test.each`
        yearsServiced | isDisabled | expected
        ${21}          | ${false}   | ${8700_000}
        ${30}          | ${false}   | ${15000_000}
        ${21}          | ${true}   | ${9700_000}
        ${30}          | ${true}   | ${16000_000}
        `(`勤続年数：$yearsServiced, 障害が起因：$isDisabled, 期待値：$expected`, ({ yearsServiced, isDisabled, expected }) => {
            const deduction = calcRetirementIncomeDeduction({ yearsServiced, isDisabled })
            expect(deduction).toBe(expected)
        })
    })
})

describe("課税対象金額", () => {
    describe("勤続年数が5年を超える場合", () => {
        test.each`
        yearsServiced | retirementIncome | isExecutiveOfficer | deduction | expected
        ${6} | ${2990_300} | ${false} | ${2_400_000} | ${295000}
        ${6} | ${3000_000} | ${false} | ${2_400_000} | ${300000}
        ${6} | ${3101_000} | ${false} | ${2_400_000} | ${350000}
        ${6} | ${5010_000} | ${false} | ${2_400_000} | ${1305000}
        ${6} | ${2990_300} | ${true} | ${2_400_000} | ${295000}
        ${6} | ${3000_000} | ${true} | ${2_400_000} | ${300000}
        ${6} | ${3101_000} | ${true} | ${2_400_000} | ${350000}
        ${6} | ${5010_000} | ${true} | ${2_400_000} | ${1305000}
        ${10} | ${2990_300} | ${false} | ${4_000_000} | ${0}
        ${10} | ${3000_000} | ${false} | ${4_000_000} | ${0}
        ${10} | ${3101_000} | ${false} | ${4_000_000} | ${0}
        ${10} | ${5010_000} | ${false} | ${4_000_000} | ${505000}
        ${10} | ${2990_300} | ${true} | ${4_000_000} | ${0}
        ${10} | ${3000_000} | ${true} | ${4_000_000} | ${0}
        ${10} | ${3101_000} | ${true} | ${4_000_000} | ${0}
        ${10} | ${5010_000} | ${true} | ${4_000_000} | ${505000}
        `(
            `勤続年数：$yearsServiced, 退職所得：$retirementIncome, 役員等：$isExecutiveOfficer 退職所得控除額：$deduction, 期待値：$expected`,
            ({ yearsServiced, retirementIncome, isExecutiveOfficer, deduction, expected }) => {
            const amount = calcTaxationTargetAmount({ yearsServiced, retirementIncome, isExecutiveOfficer, deduction})
            expect(amount).toBe(expected);
        })
    })
    describe("勤続年数が5年以下の場合", () => {
        describe("役員等の場合", () => {
            test.each`
             yearsServiced | retirementIncome | isExecutiveOfficer | deduction | expected
            ${1} | ${2990_300} | ${true} | ${800_000} | ${2190000}
            ${1} | ${3000_000} | ${true} | ${800_000} | ${2200000}
            ${1} | ${3101_000} | ${true} | ${800_000} | ${2301000}
            ${1} | ${5010_000} | ${true} | ${800_000} | ${4210000}
            ${5} | ${2990_300} | ${true} | ${2_000_000} | ${990000}
            ${5} | ${3000_000} | ${true} | ${2_000_000} | ${1000000}
            ${5} | ${3101_000} | ${true} | ${2_000_000} | ${1101000}
            ${5} | ${5010_000} | ${true} | ${2_000_000} | ${3010000}
            `(
                `勤続年数：$yearsServiced, 退職所得：$retirementIncome, 役員等：$isExecutiveOfficer 退職所得控除額：$deduction, 期待値：$expected`,
                ({ yearsServiced, retirementIncome, isExecutiveOfficer, deduction, expected }) => {
                const amount = calcTaxationTargetAmount({ yearsServiced, retirementIncome, isExecutiveOfficer, deduction})
                expect(amount).toBe(expected);
            })
        })
        describe("役員等以外の場合", () => {
            describe("控除後の金額が300万円以下の場合", () => {
                test.each`
                yearsServiced | retirementIncome | isExecutiveOfficer | deduction | expected
                ${1} | ${1000_300} | ${false} | ${800_000} | ${100000}
                ${1} | ${3101_000} | ${false} | ${800_000} | ${1150000}
                ${5} | ${1000_300} | ${false} | ${2_000_000} | ${0}
                ${5} | ${3101_000} | ${false} | ${2_000_000} | ${550000}
                `(
                    `勤続年数：$yearsServiced, 退職所得：$retirementIncome, 役員等：$isExecutiveOfficer 退職所得控除額：$deduction, 期待値：$expected`,
                    ({ yearsServiced, retirementIncome, isExecutiveOfficer, deduction, expected }) => {
                    const amount = calcTaxationTargetAmount({ yearsServiced, retirementIncome, isExecutiveOfficer, deduction})
                    expect(amount).toBe(expected);
                })
            })
            describe("控除後の金額が300万円を超える場合", () => {
                test.each`
                yearsServiced | retirementIncome | isExecutiveOfficer | deduction | expected
                ${1} | ${3810_400} | ${false} | ${800_000} | ${1510000}
                ${1} | ${5010_700} | ${false} | ${800_000} | ${2710000}
                ${5} | ${5010_700} | ${false} | ${2_000_000} | ${1510000}
                ${5} | ${12010_000} | ${false} | ${2_000_000} | ${8510000}
                `(
                    `勤続年数：$yearsServiced, 退職所得：$retirementIncome, 役員等：$isExecutiveOfficer 退職所得控除額：$deduction, 期待値：$expected`,
                    ({ yearsServiced, retirementIncome, isExecutiveOfficer, deduction, expected }) => {
                    const amount = calcTaxationTargetAmount({ yearsServiced, retirementIncome, isExecutiveOfficer, deduction})
                    expect(amount).toBe(expected);
                })
            })
        })
    })
})
