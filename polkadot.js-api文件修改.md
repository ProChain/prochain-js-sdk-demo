
### 文件修改
## 当前版本
* @polkadot/api: ^0.100.0-beta.19
* @polkadot/keyring: ^1.7.1
* @polkadot/util: ^1.7.1
* @polkadot/util-crypto: ^1.7.1

## 文件1
/node_modules/@polkadot/types/primitive/StorageHasher.js

# 17行
增加类型：Blake2_128Concat，如下：
```
super(registry, ['Blake2_128', 'Blake2_256', 'Twox128', 'Twox256', 'Twox64Concat', 'Blake2_128Concat'], value);
```

在函数isTwox64Concat下增加函数isBlake2_128Concat，如下：
```
get isTwox64Concat() {
  return this.toNumber() === 4;
}

get isBlake2_128Concat() {
  return this.toNumber() === 5;
}
```

# 75行
增加类型：Twox128Concat，如下：
```
    super(registry, ['Blake2_128', 'Blake2_256', 'Blake2_128Concat', 'Twox128', 'Twox256', 'Twox64Concat', 'Twox128Concat'], value);
```

在函数isTwox64Concat下增加函数isBlake2_128Concat，如下：
```
get isTwox64Concat() {
  return this.toNumber() === 5;
}

get isTwox128Concat() {
  return this.toNumber() === 6;
}
```

## 文件2
/node_modules/@polkadot/types/interfaces/system/definitions.js
在DispatchResultTo198下添加类型，如下：
```
DispatchResultTo198: 'Result<(), Text>',
Timepoint: {
  height: 'BlockNumber',
  index: 'u32'
},
Multisig: {
  when: 'Timepoint<BlockNumber>',
  deposit: 'Balance',
  depositor: 'AccountId',
  approvals: 'Vec<AccountId>'
},
```