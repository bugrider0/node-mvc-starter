import { MultilingualFields } from '../utils';

interface IMultilingual {
  entity: string;
  locale: string;
  populated?: {};
}

export default class Multilingual {
  private readonly locale: string;
  private readonly MLFields: Array<string>;
  private readonly populated: {
    [x: string]: string;
  };
  private defaultLocale = 'en';

  constructor(props: IMultilingual) {
    this.locale = props.locale;
    this.MLFields = MultilingualFields(props.entity);
    this.populated = props.populated || {};
  }

  private processRecord(item: any, MLFields: Array<string>): any {
    try {
      if (!item) return item;
      let keys = Object.keys(item);
      let key = '';
      let itemJSON;
      // Iterating throw record
      for (let i = 0; i < keys.length; i++) {
        key = keys[i];

        // Checking if this field is multilingual
        if (MLFields.indexOf(key.toString()) > -1) {
          // Fetching current locale value
          try {
            itemJSON = JSON.parse(item[key]);
            item[key] = itemJSON[this.locale] ?? itemJSON[this.defaultLocale] ?? '';
          } catch (e) {
            continue;
          }
        }

        // Checking if this field contains sub document
        if (key !== '_id' && typeof item[key] === 'object') {
          if (Array.isArray(item[key])) {
            for (let i = 0; i < item[key].length; i++) {
              item[key][i] = this.processRecord(item[key][i], MultilingualFields(this.populated[key]));
            }
          } else {
            item[key] = this.processRecord(item[key], MultilingualFields(this.populated[key]));
          }
        }
      }
      return item;
    } catch (e) {
      throw e;
    }
  }

  public create(addingEntity: any): any {
    try {
      // Checking that if MLFields is empty no need for operations
      if (this.MLFields.length === 0) {
        return addingEntity;
      }

      // Iterating through create fields
      let keys = Object.keys(addingEntity);
      let key = '';
      for (let i = 0; i < keys.length; i++) {
        key = keys[i];

        // Checking if this field is multilingual
        if (this.MLFields.indexOf(key.toString()) > -1) {
          // Replacing value by locale:value
          addingEntity[key] = JSON.stringify({
            [this.locale]: addingEntity[key],
          });
        }
      }

      return addingEntity;
    } catch (e) {
      throw e;
    }
  }

  public getMany(list: Array<any>): Array<any> {
    try {
      // Checking that if MLFields is empty and list is not populated no need for operations
      if (this.MLFields.length === 0 && !this.populated) {
        return list;
      }

      // Iterating through list
      for (let i = 0; i < list.length; i++) {
        list[i] = this.processRecord(list[i], this.MLFields);
      }

      return list;
    } catch (e) {
      throw e;
    }
  }

  public getOne(item: any): any {
    try {
      // Checking that if MLFields is empty no need for operations
      if (this.MLFields.length === 0 && !this.populated) {
        return item;
      }

      return this.processRecord(item, this.MLFields);
    } catch (e) {
      throw e;
    }
  }

  public update(item: any, update: any): any {
    try {
      // Checking that if MLFields is empty no need for operations
      if (this.MLFields.length === 0) {
        return update;
      }

      // Checking if there are results to update
      if (!item) {
        return update;
      }

      let keys = Object.keys(update);
      let key = '';
      let oldValue, oldValueJSON, newValueJSON;
      // Iterating through update fields
      for (let i = 0; i < keys.length; i++) {
        key = keys[i];
        // Checking if this field is multilingual
        if (this.MLFields.indexOf(key) > -1) {
          // Getting old value
          oldValue = item[key] ?? '{}';
          newValueJSON = oldValueJSON = JSON.parse(oldValue);
          if (oldValueJSON[this.locale]) {
            // The value in this locale exists and should be updated
            newValueJSON[this.locale] = update[key];
          } else {
            // The value in this locale not exists and should be added
            newValueJSON = { ...newValueJSON, [this.locale]: update[key] };
          }
          update[key] = JSON.stringify(newValueJSON);
        }
      }

      return update;
    } catch (e) {
      throw e;
    }
  }
}
