import { RamCpuDiscounts } from "../dictionaries/RamCpuDiscounts";
import { ProductPrices } from "../dictionaries/ProductPrices";

export class RamCpuPriceService {
  static calcMonthPrice(cpu, ram) {
    const discountItem = this._findDiscountItem(cpu, ram);
    let resultCpuPrice = ProductPrices.VCPU.month * cpu;
    let resultRamPrice = ProductPrices.VMemory.month * ram;
    if (discountItem) {
      const discountPercent = discountItem.percent;
      resultCpuPrice = resultCpuPrice - resultCpuPrice * discountPercent;
      resultRamPrice = resultRamPrice - resultRamPrice * discountPercent;
    }

    return resultRamPrice + resultCpuPrice;
  }

  static calcCpuPrice(cpu, ram) {
    const discountItem = this._findDiscountItem(cpu, ram);
    let resultCpuPrice = ProductPrices.VCPU.month * cpu;
    if (discountItem) {
      const discountPercent = discountItem.percent;
      resultCpuPrice = resultCpuPrice - resultCpuPrice * discountPercent;
    }

    return resultCpuPrice;
  }

  static calcRamPrice(ram, cpu) {
    const discountItem = this._findDiscountItem(cpu, ram);
    let resultRamPrice = ProductPrices.VMemory.month * ram;
    if (discountItem) {
      const discountPercent = discountItem.percent;
      resultRamPrice = resultRamPrice - resultRamPrice * discountPercent;
    }

    return resultRamPrice;
  }

  static _findDiscountItem(cpu, ram) {
    return RamCpuDiscounts.find((item) => {
      return item.cpu === cpu && item.ram === ram;
    });
  }
}