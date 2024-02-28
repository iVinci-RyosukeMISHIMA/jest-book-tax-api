import calcRetirementIncomeDeduction from "../calcTax";

describe("退職所得控除額",()=> {
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
