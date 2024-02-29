import { calcRetirementIncomeDeduction, calcTaxationTargetAmount, calcBaseIncomeAmount, calcWithHoldingTax } from "../calcTax"

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

describe("基準所得金額", () => {
    describe("課税対象金額が1,000円 ~ 1,949,000円", () => {
        test.each`
        taxationTargetAmount | expected
        ${1000} | ${50}
        ${1_000_000} | ${50_000}
        ${1_949_000} | ${97_450}
        `(
            `課税対象金額：$taxationTargetAmount, 期待値：$expected`,
                ({taxationTargetAmount, expected})=> {
                    const baseIncomeAmount = calcBaseIncomeAmount(taxationTargetAmount);
                    expect(baseIncomeAmount).toBe(expected)
            }
        )
    })
    describe("課税対象金額が1,950,000円 ~ 3,299,000円", () => {
        test.each`
        taxationTargetAmount | expected
        ${1_950_000} | ${97_500}
        ${2_500_000} | ${152_500}
        ${3_299_000} | ${232_400}
        `(
            `課税対象金額：$taxationTargetAmount, 期待値：$expected`,
                ({taxationTargetAmount, expected})=> {
                    const baseIncomeAmount = calcBaseIncomeAmount(taxationTargetAmount);
                    expect(baseIncomeAmount).toBe(expected)
            }
        )
    })
    describe("課税対象金額が3,300,000円 ~ 6,949,000円", () => {
        test.each`
        taxationTargetAmount | expected
        ${3_300_000} | ${232_500}
        ${5_000_000} | ${572_500}
        ${6_949_000} | ${962_300}
        `(
            `課税対象金額：$taxationTargetAmount, 期待値：$expected`,
                ({taxationTargetAmount, expected})=> {
                    const baseIncomeAmount = calcBaseIncomeAmount(taxationTargetAmount);
                    expect(baseIncomeAmount).toBe(expected)
            }
        )
    })
    describe("課税対象金額が6,950,000円 ~ 8,999,000円", () => {
        test.each`
        taxationTargetAmount | expected
        ${6_950_000} | ${962_500}
        ${8_000_000} | ${1_204_000}
        ${8_999_000} | ${1_433_770}
        `(
            `課税対象金額：$taxationTargetAmount, 期待値：$expected`,
                ({taxationTargetAmount, expected})=> {
                    const baseIncomeAmount = calcBaseIncomeAmount(taxationTargetAmount);
                    expect(baseIncomeAmount).toBe(expected)
            }
        )
    })
    describe("課税対象金額が9,000,000円 ~ 17,999,000円", () => {
        test.each`
        taxationTargetAmount | expected
        ${9_000_000} | ${1_434_000}
        ${13_500_000} | ${2_919_000}
        ${17_999_000} | ${4_403_670}
        `(
            `課税対象金額：$taxationTargetAmount, 期待値：$expected`,
                ({taxationTargetAmount, expected})=> {
                    const baseIncomeAmount = calcBaseIncomeAmount(taxationTargetAmount);
                    expect(baseIncomeAmount).toBe(expected)
            }
        )
    })
    describe("課税対象金額が18,000,000円 ~ 39,999,000円", () => {
        test.each`
        taxationTargetAmount | expected
        ${18_000_000} | ${4_404_000}
        ${29_000_000} | ${8_804_000}
        ${39_999_000} | ${13_203_600}
        `(
            `課税対象金額：$taxationTargetAmount, 期待値：$expected`,
                ({taxationTargetAmount, expected})=> {
                    const baseIncomeAmount = calcBaseIncomeAmount(taxationTargetAmount);
                    expect(baseIncomeAmount).toBe(expected)
            }
        )
    })
    describe("課税対象金額が40,000,000円 ~", () => {
        test.each`
        taxationTargetAmount | expected
        ${40_000_000} | ${13_204_000}
        ${60_000_000} | ${22_204_000}
        `(
            `課税対象金額：$taxationTargetAmount, 期待値：$expected`,
                ({taxationTargetAmount, expected})=> {
                    const baseIncomeAmount = calcBaseIncomeAmount(taxationTargetAmount);
                    expect(baseIncomeAmount).toBe(expected)
            }
        )
    })
})

describe("源泉徴収税額（所得税）", () => {
    test.each`
    baseIncomeAmount | expected
    ${50} | ${51}
    ${97_500} | ${99_547}
    ${232_500} | ${237_382}
    ${962500} | ${982712}
    ${1434000} | ${1464114}
    ${4_404_000} | ${4_496_484}
    ${13_204_000} | ${13_481_284}
    `(
        `基準所得金額：$baseIncomeAmount`,
        ({ baseIncomeAmount, expected }) => {
            const withHoldingTax = calcWithHoldingTax(baseIncomeAmount);
            expect(withHoldingTax).toBe(expected)
        }
    )
})
