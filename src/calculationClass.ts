/*
 * @description: 计算器工具类，使用Decimal.js库，解决js浮点数计算精度问题，使用方法如下：
 * @author: Yoke
 * @Date: 2024-01-30 15:20:25
 */
import Decimal from 'decimal.js';

/**
 * 计算器接口
 */
export interface CalculatorImpl {
    result: Decimal;
    // 加法
    add: (...values: string[]) => CalculatorImpl;
    // 减法
    subtract: (...values: string[]) => CalculatorImpl;
    // 乘法
    multiply: (...values: string[]) => CalculatorImpl;
    // 除法
    divide: (...values: string[]) => CalculatorImpl;
    // 获取结果
    getResult: () => string;
}

/**
 * 计算器类
 * @param initialValue
 * @returns 
 */
export class Calculator implements CalculatorImpl {
    public result: any;

    constructor(initialValue: number = 0) {
        this.result = new Decimal(initialValue);
    }

    /**
     * 加法
     * @param values
     * @returns
     */
    add(...values: string[]) {
        values.forEach((value) => {
            this.result = this.result.add(value);
        });
        return this;
    }

    /**
     * 减法
     * @param values
     * @returns
     */
    subtract(...values: string[]) {
        values.forEach((value) => {
            this.result = this.result.sub(value);
        });
        return this;
    }

    /**
     * 乘法
     * @param values
     * @returns
     */
    multiply(...values: string[]) {
        values.forEach((value) => {
            this.result = this.result.mul(value);
        });
        return this;
    }

    /**
     * 除法
     * @param values
     * @returns
     */
    divide(...values: string[]) {
        values.forEach((value) => {
            this.result = this.result.div(value);
        });
        return this;
    }

    getResult() {
        return this.result.toString();
    }
}