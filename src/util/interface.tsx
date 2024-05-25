/* eslint-disable @typescript-eslint/no-explicit-any */
export interface reduxAuth {
    auth: any
}
export interface reduxModal {
    modal: any
}

export interface apiDataInterface {
    data?: any,
    error?: any
}
export interface permissionsInterface {
    id?: number | string;
    isAdd?: boolean;
    isDelete?: boolean;
    isNone?: boolean;
    isRead?: boolean;
    isUpdate?: boolean;
    screenName?: string;
}
export interface refetchInterface {
    refetch: () => void;
}

export interface objectInterface {
    [key: string]: any;
}

export interface FormikActionInterface {
    resetForm: () => void;
  }

  export interface loadingReduxModal {
    loadingReducer: any
  }
  export interface authReduxModal {
    auth: any
  }