import { calcRetirementIncomeDeduction, calcTaxationTargetAmount } from "../calcTax"

describe("退職所得控除額 = 勤続年数（20年以前）* 控除額（20年以前） + 勤続年数（21年目以降）* 控除額（21年目以降） + 障害補填（障害が起因の場合）",()=> {
    test.each`
    yearsServiced | isDisabled | expected
    ${1}          | ${false}   | ${800_000}
    ${2}          | ${false}   | ${800_000}
    ${3}          | ${false}   | ${1200_000}
    ${19}          | ${false}   | ${7600_000}
    ${20}          | ${false}   | ${8000_000}
    ${21}          | ${false}   | ${8700_000}
    ${30}          | ${false}   | ${15000_000}
    
    ${1}          | ${true}   | ${1800_000}
    ${2}          | ${true}   | ${1800_000}
    ${3}          | ${true}   | ${2200_000}
    ${19}          | ${true}   | ${8600_000}
    ${20}          | ${true}   | ${9000_000}
    ${21}          | ${true}   | ${9700_000}
    ${30}          | ${true}   | ${16000_000}
`(`勤続年数：$yearsServiced, 障害が起因：$isDisabled, 期待値：$expected`, ({ yearsServiced, isDisabled, expected }) => {
    const deduction = calcRetirementIncomeDeduction({yearsServiced, isDisabled})
    expect(deduction).toBe(expected)
    }
)
})

describe("課税対象金額", () => {
    test.each`
    yearsServiced | retirementIncome | isExecutiveOfficer | isDisabled | expected
    ${1} | ${2990_300} | ${false} | ${false} | ${1095000}
    ${1} | ${3000_000} | ${false} | ${false} | ${1100000}
    ${1} | ${3101_000} | ${false} | ${false} | ${1150000}
    ${1} | ${5010_000} | ${false} | ${false} | ${2710000}
    
    ${1} | ${2990_300} | ${true} | ${false} | ${2190000}
    ${1} | ${3000_000} | ${true} | ${false} | ${2200000}
    ${1} | ${3101_000} | ${true} | ${false} | ${2301000}
    ${1} | ${5010_000} | ${true} | ${false} | ${4210000}
    
    ${4} | ${2990_300} | ${false} | ${false} | ${695000}
    ${4} | ${3000_000} | ${false} | ${false} | ${700000}
    ${4} | ${3101_000} | ${false} | ${false} | ${750000}
    ${4} | ${5010_000} | ${false} | ${false} | ${1910000}

    ${4} | ${2990_300} | ${true} | ${false} | ${1390000}
    ${4} | ${3000_000} | ${true} | ${false} | ${1400000}
    ${4} | ${3101_000} | ${true} | ${false} | ${1501000}
    ${4} | ${5010_000} | ${true} | ${false} | ${3410000}

    ${5} | ${2990_300} | ${false} | ${false} | ${495000}
    ${5} | ${3000_000} | ${false} | ${false} | ${500000}
    ${5} | ${3101_000} | ${false} | ${false} | ${550000}
    ${5} | ${5010_000} | ${false} | ${false} | ${1510000}

    ${5} | ${2990_300} | ${true} | ${false} | ${990000}
    ${5} | ${3000_000} | ${true} | ${false} | ${1000000}
    ${5} | ${3101_000} | ${true} | ${false} | ${1101000}
    ${5} | ${5010_000} | ${true} | ${false} | ${3010000}

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
    `(`勤続年数：$yearsServiced, 退職所得：$retirementIncome, 役員等：$isExecutiveOfficer 障害が起因：$isDisabled, 期待値：$expected`, ({ yearsServiced, retirementIncome, isExecutiveOfficer,isDisabled, expected }) => {
        const amount = calcTaxationTargetAmount({ yearsServiced, retirementIncome, isExecutiveOfficer, isDisabled})
        expect(amount).toBe(expected);
    })
})