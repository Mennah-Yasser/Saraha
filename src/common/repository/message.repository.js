import { MessageModel } from '../../DB/model/message.model.js'
import * as base from './base.repository.js'

export const findOne = async ({
    filter = {},
    options = {}
} = {}) => {
    return await base.findOne({filter,options,model:MessageModel})
}

export const create = async ({
    data = [{}],
    options = { validateBeforeSave: true }
} = {}) => {
    return await base.create({ model: MessageModel, data, options})
}

export const createOne = async ({
    data = {},
    options = { validateBeforeSave: true }
} = {}) => {
    return await base.createOne({ model: MessageModel, data, options})
}


export const findById = async ({
    id,
    options = {}
}) =>{
    return await base.findById({ model: MessageModel, id, options})
}

export const find = async ({
    filter = {},
    options = {},
}= {}) => {
    return await base.find({ model: MessageModel, filter, options})
}

export const countDocument = async ({
    filter = {},
}= {}) => {
    return await base.countDocument({ model: MessageModel, filter })
}

export const pagiante = async ({
    filter = {},
    options = {},
    model,
    page =1,
    limit = 5
}= {}) => {
    return await base.pagiante({ model: MessageModel, filter, options,model,page,limit})
}

export const insertMany = async ({
    data,
    model
}) => {
    return await base.insertMany({ model: MessageModel, data, model})
}

export const updateOne = async ({
    filter,
    update,
    options,
    model
}= {}) => {
    return await base.updateOne({ model: MessageModel, filter,update,model, options})
}

export const findOneAndUpdate = async ({
    filter,
    update,
    options,
    model
} = {}) => {
    return await base.findOneAndUpdate({ model: MessageModel, filter,update,model, options})
}

export const findByIdAndUpdate = async ({
    id,
    update,
    options = { new: true },
    model
}) => {
    return await base.findByIdAndUpdate({ model: MessageModel, id,update,model, options})
}

export const deleteOne = async ({
    filter,
    model
}) => {
    return await base.deleteOne({ model: MessageModel, filter, model})
}

export const deleteMany = async ({
    filter,
    model
}) => {
    return await base.deleteMany({ model: MessageModel, filter, model})
}

export const findOneAndDelete = async ({
    filter,
    model
} = {}) => {
    return await base.findOneAndDelete({ model: MessageModel, filter, model})
}
