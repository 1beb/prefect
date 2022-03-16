import { State as StateType } from '@prefecthq/orion-design'

export interface IState {
  id: string,
  type: StateType,
  message: string,
  state_details: Record<string, any>,
  data: Record<string, any>,
  timestamp: string,
  name: string,
}

export default class State implements IState {
  public id: string
  public type: StateType
  public message: string
  public state_details: Record<string, any>
  public data: Record<string, any>
  public timestamp: string
  public name: string

  constructor(state: IState) {
    this.id = state.id
    this.type = state.type
    this.message = state.message
    this.state_details = state.state_details
    this.data = state.data
    this.timestamp = state.timestamp
    this.name = state.name
  }
}
