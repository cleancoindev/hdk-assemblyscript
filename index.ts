import "allocator/tlsf";

import {
  u32_high_bits,
  u32_low_bits,
  serialize,
  deserialize,
  check_encoded_allocation,
  errorCodeToString,
  free
} from './utils';

import {
  CommitResult,
  CommitResultParser
} from './types'

export {
  CommitResult,
  CommitResultParser
} from './types'

import {
  parseString
} from './node_modules/asm-json-parser/lib/index'

export {
  parseString,
  Handler
} from './node_modules/asm-json-parser/lib/index'

export {
  u32_high_bits,
  u32_low_bits,
  serialize,
  deserialize,
  check_encoded_allocation,
  errorCodeToString,
  free
} from './utils';

declare namespace env {
  function hc_debug(encoded_allocation_of_input: u32): u32;
  function hc_call(encoded_allocation_of_input: u32): u32;
  function hc_sign(encoded_allocation_of_input: u32): u32;
  function hc_verify_signature(encoded_allocation_of_input: u32): u32;
  function hc_commit_entry(encoded_allocation_of_input: u32): u32;
  function hc_update_entry(encoded_allocation_of_input: u32): u32;
  function hc_update_agent(encoded_allocation_of_input: u32): u32;
  function hc_remove_entry(encoded_allocation_of_input: u32): u32;
  function hc_get_entry(encoded_allocation_of_input: u32): u32;
  function hc_link_entries(encoded_allocation_of_input: u32): u32;
  function hc_query(encoded_allocation_of_input: u32): u32;
  function hc_send(encoded_allocation_of_input: u32): u32;
  function hc_start_bundle(encoded_allocation_of_input: u32): u32;
  function hc_close_bundle(encoded_allocation_of_input: u32): u32;
}


export const enum ErrorCode {
  Success = 0,
  Failure = 1,
  ArgumentDeserializationFailed = 2,
  OutOfMemory = 3,
  ReceivedWrongActionResult = 4,
  CallbackFailed = 5,
  RecursiveCallForbidden = 6,
  ResponseSerializationFailed = 7,
  PageOverflowError = 8, // returned by hdk if offset+size exceeds a page
}




export function debug(message: string): void {
  let encoded_allocation: u32 = serialize(message);
  // let ptr = u32_high_bits(encoded_allocation);
  env.hc_debug(encoded_allocation);
}



export function commit_entry(entryType: string, entryContent: string): CommitResult {
  let jsonEncodedParams: string = `{"entry_type_name":"`+entryType+`","entry_content":"`+entryContent+`"}`;

  let encoded_allocation: u32 = serialize(jsonEncodedParams);
  let result: u32 = env.hc_commit_entry(encoded_allocation);
  let errorCode = check_encoded_allocation(result)

  if(errorCode === ErrorCode.Success) {
    let jsonString = deserialize(result);
    let resultObject = new CommitResult();
    let parser = new CommitResultParser(resultObject);
    parseString<CommitResultParser>(jsonString, parser)
    return resultObject
  } else {
    return new CommitResult();
  }

}



export function get_entry(hash: string): string {
  let jsonEncodedParams: string = `{"key":"`+hash+`"}`;

  let encoded_allocation: u32 = serialize(jsonEncodedParams);
  let result: u32 = env.hc_get_entry(encoded_allocation);
  let errorCode = check_encoded_allocation(result)

  if(errorCode === ErrorCode.Success) {
    return deserialize(result)
  } else {
    return errorCodeToString(errorCode)
  }
}

// export function init_globals() {

// }
