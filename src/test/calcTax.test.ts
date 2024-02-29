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
        yearsServiced | retirementIncome | isExecutiveOfficer | isDisabled | expected
        ${6} | ${2990_300} | ${false} | ${false} | ${295000}
        ${6} | ${3000_000} | ${false} | ${false} | ${300000}
        ${6} | ${3101_000} | ${false} | ${false} | ${350000}
        ${6} | ${5010_000} | ${false} | ${false} | ${1305000}
        ${6} | ${2990_300} | ${true} | ${false} | ${295000}
        ${6} | ${3000_000} | ${true} | ${false} | ${300000}
        ${6} | ${3101_000} | ${true} | ${false} | ${350000}
        ${6} | ${5010_000} | ${true} | ${false} | ${1305000}
        ${10} | ${2990_300} | ${false} | ${false} | ${0}
        ${10} | ${3000_000} | ${false} | ${false} | ${0}
        ${10} | ${3101_000} | ${false} | ${false} | ${0}
        ${10} | ${5010_000} | ${false} | ${false} | ${505000}
        ${10} | ${2990_300} | ${true} | ${false} | ${0}
        ${10} | ${3000_000} | ${true} | ${false} | ${0}
        ${10} | ${3101_000} | ${true} | ${false} | ${0}
        ${10} | ${5010_000} | ${true} | ${false} | ${505000}
        `(
            `勤続年数：$yearsServiced, 退職所得：$retirementIncome, 役員等：$isExecutiveOfficer 障害が起因：$isDisabled, 期待値：$expected`,
            ({ yearsServiced, retirementIncome, isExecutiveOfficer, isDisabled, expected }) => {
            const amount = calcTaxationTargetAmount({ yearsServiced, retirementIncome, isExecutiveOfficer, isDisabled})
            expect(amount).toBe(expected);
        })
    })
    describe("勤続年数が5年以下の場合", () => {
        describe("役員等の場合", () => {
            test.each`
             yearsServiced | retirementIncome | isExecutiveOfficer | isDisabled | expected
            ${1} | ${2990_300} | ${true} | ${false} | ${2190000}
            ${1} | ${3000_000} | ${true} | ${false} | ${2200000}
            ${1} | ${3101_000} | ${true} | ${false} | ${2301000}
            ${1} | ${5010_000} | ${true} | ${false} | ${4210000}
            ${5} | ${2990_300} | ${true} | ${false} | ${990000}
            ${5} | ${3000_000} | ${true} | ${false} | ${1000000}
            ${5} | ${3101_000} | ${true} | ${false} | ${1101000}
            ${5} | ${5010_000} | ${true} | ${false} | ${3010000}
            `(
                `勤続年数：$yearsServiced, 退職所得：$retirementIncome, 役員等：$isExecutiveOfficer 障害が起因：$isDisabled, 期待値：$expected`,
                ({ yearsServiced, retirementIncome, isExecutiveOfficer, isDisabled, expected }) => {
                const amount = calcTaxationTargetAmount({ yearsServiced, retirementIncome, isExecutiveOfficer, isDisabled})
                expect(amount).toBe(expected);
            })
        })
        describe("役員等以外の場合", () => {
            describe("控除後の金額が300万円以下の場合", () => {
                test.each`
                yearsServiced | retirementIncome | isExecutiveOfficer | isDisabled | expected
                ${1} | ${1000_300} | ${false} | ${false} | ${100000}
                ${1} | ${3101_000} | ${false} | ${false} | ${1150000}
                ${5} | ${1000_300} | ${false} | ${false} | ${0}
                ${5} | ${3101_000} | ${false} | ${false} | ${550000}
                `(
                    `勤続年数：$yearsServiced, 退職所得：$retirementIncome, 役員等：$isExecutiveOfficer 障害が起因：$isDisabled, 期待値：$expected`,
                    ({ yearsServiced, retirementIncome, isExecutiveOfficer, isDisabled, expected }) => {
                    const amount = calcTaxationTargetAmount({ yearsServiced, retirementIncome, isExecutiveOfficer, isDisabled})
                    expect(amount).toBe(expected);
                })
            })
            describe("控除後の金額が300万円を超える場合", () => {
                test.each`
                yearsServiced | retirementIncome | isExecutiveOfficer | isDisabled | expected
                ${1} | ${3810_400} | ${false} | ${false} | ${1510000}
                ${1} | ${5010_700} | ${false} | ${false} | ${2710000}
                ${5} | ${5010_700} | ${false} | ${false} | ${1510000}
                ${5} | ${12010_000} | ${false} | ${false} | ${8510000}
                `(
                    `勤続年数：$yearsServiced, 退職所得：$retirementIncome, 役員等：$isExecutiveOfficer 障害が起因：$isDisabled, 期待値：$expected`,
                    ({ yearsServiced, retirementIncome, isExecutiveOfficer, isDisabled, expected }) => {
                    const amount = calcTaxationTargetAmount({ yearsServiced, retirementIncome, isExecutiveOfficer, isDisabled})
                    expect(amount).toBe(expected);
                })
            })
        })
    })
})    
    
