import { UserModel} from '../../DB/model/user.model.js'
import * as base from './base.repository.js'

export const findOne = async ({
    filter = {},
    options = {}
} = {}) => {
    return await base.findOne({filter,options,model:UserModel})
}

export const create = async ({
    data = [{}],
    options = { validateBeforeSave: true }
} = {}) => {
    return await base.create({ model: UserModel
        , data, options})
}

export const createOne = async ({
    data = {},
    options = { validateBeforeSave: true }
} = {}) => {
    return await base.createOne({ model: UserModel
        , data, options})
}


export const findById = async ({
    id,
    options = {}
}) =>{
    return await base.findById({ model: UserModel
        , id, options})
}

export const find = async ({
    filter = {},
    options = {},
}= {}) => {
    return await base.createOne({ model: UserModel
        , filter, options})
}

export const countDocument = async ({
    filter = {},
}= {}) => {
    return await base.countDocument({ model: UserModel
        , filter })
}

export const pagiante = async ({
    filter = {},
    options = {},
    model,
    page =1,
    limit = 5
}= {}) => {
    return await base.pagiante({ model: UserModel
        , filter, options,model,page,limit})
}

export const insertMany = async ({
    data,
    model
}) => {
    return await base.insertMany({ model: UserModel
        , data, model})
}

export const updateOne = async ({
    filter,
    update,
    options,
    model
}= {}) => {
    return await base.updateOne({ model: UserModel
        , filter,update,model, options})
}

export const findOneAndUpdate = async ({
    filter,
    update,
    options,
    model
} = {}) => {
    return await base.findOneAndUpdate({ model: UserModel
        , filter,update,model, options})
}

export const findByIdAndUpdate = async ({
    id,
    update,
    options = { new: true },
    model
}) => {
    return await base.findByIdAndUpdate({ model: UserModel
        , id,update,model, options})
}

export const deleteOne = async ({
    filter,
    model
}) => {
    return await base.deleteOne({ model: UserModel
        , filter, model})
}

export const deleteMany = async ({
    filter,
    model
}) => {
    return await base.deleteMany({ model: UserModel
        , filter, model})
}

export const findOneAndDelete = async ({
    filter,
    model
} = {}) => {
    return await base.findOneAndDelete({ model: UserModel
        , filter, model})
}
