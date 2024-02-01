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
    add: (...values: Decimal.Value[]) => CalculatorImpl;
    // 减法
    subtract: (...values: Decimal.Value[]) => CalculatorImpl;
    // 乘法
    multiply: (...values: Decimal.Value[]) => CalculatorImpl;
    // 除法
    divide: (...values: Decimal.Value[]) => CalculatorImpl;
    // 获取结果
    getResult: () => string;
}

/**
 * 计算器类
 * @param initialValue
 * @returns 
 */
export class Calculator implements CalculatorImpl {
    public result: Decimal;
    private index: number = 0;
    constructor() {
        this.result = new Decimal(0);
    }
    /**
     * 加法
     * @param values
     * @returns
     */
    add(...values: Decimal.Value[]) {
        this.index++;
        values.forEach((value) => {
            this.result = this.result.plus(value);
        });
        return this;
    }

    /**
     * 减法
     * @param values
     * @returns
     */
    subtract(...values: Decimal.Value[]) {
        this._setInitResut(values);
        values.forEach((value) => {
            this.result = this.result.minus(value);
        });
        return this;
    }

    /**
     * 乘法
     * @param values
     * @returns
     */
    multiply(...values: Decimal.Value[]) {
        this._setInitResut(values);
        values.forEach((value) => {
            this.result = this.result.times(value);
        });
        return this;
    }

    /**
     * 除法
     * @param values
     * @returns
     */
    divide(...values: Decimal.Value[]) {
        this._setInitResut(values);
        values.forEach((value) => {
            this.result = this.result.dividedBy(value);
        });
        return this;
    }

    _setInitResut(values: Decimal.Value[]) {
        // 第一次调用时，将第一个值赋值给result
        if (this.index === 0) {
            this.result = this.result.plus(values[0]);
            values.shift();
        }
        this.index++;
    }

    getResult() {
        return this.result.toString();
    }
}