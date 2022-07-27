export interface TeamSchema {
  _id: string,
  name: string,
  leader: string,
  participants: any[],
  todos: any[],
  __v: number
};

export interface CreateTeamSchema {
  leader: string,
  name: string,
  participants: any[],
  todos: []
};

export interface UpdateTeamSchema {
  name?: string,
  leader?: string,
  participants?: [],
  todos?: []
};
